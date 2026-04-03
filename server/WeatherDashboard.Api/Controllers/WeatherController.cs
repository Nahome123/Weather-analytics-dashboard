using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeatherDashboard.Api.Data;
using WeatherDashboard.Api.Dtos;
using WeatherDashboard.Api.Models;
using WeatherDashboard.Api.Services;

namespace WeatherDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private readonly IGeocodingService _geocodingService;
    private readonly IWeatherService _weatherService;
    private readonly AppDbContext _dbContext;

    public WeatherController(
        IGeocodingService geocodingService,
        IWeatherService weatherService,
        AppDbContext dbContext)
    {
        _geocodingService = geocodingService;
        _weatherService = weatherService;
        _dbContext = dbContext;
    }

    [HttpGet("search")]
    public async Task<ActionResult<WeatherResponseDto>> Search([FromQuery] string city)
    {
        if (string.IsNullOrWhiteSpace(city))
            return BadRequest("City is required.");

        var location = await _geocodingService.SearchCityAsync(city);
        if (location == null)
            return NotFound("City not found.");

        var weather = await _weatherService.GetWeatherAsync(location);
        if (weather == null)
            return StatusCode(502, "Unable to fetch weather data.");

        var cityEntity = await _dbContext.Cities
            .FirstOrDefaultAsync(c =>
                c.Name == location.Name &&
                c.Country == location.Country);

        if (cityEntity == null)
        {
            cityEntity = new City
            {
                Name = location.Name,
                Country = location.Country,
                Latitude = location.Latitude,
                Longitude = location.Longitude
            };

            _dbContext.Cities.Add(cityEntity);
            await _dbContext.SaveChangesAsync();
        }

        var snapshot = new WeatherSnapshot
        {
            CityId = cityEntity.Id,
            TemperatureC = weather.Current.Temperature,
            WindSpeed = weather.Current.WindSpeed,
            WeatherCode = weather.Current.WeatherCode,
            RecordedAt = DateTime.UtcNow
        };

        var searchLog = new SearchLog
        {
            CityId = cityEntity.Id,
            SearchedAt = DateTime.UtcNow
        };

        _dbContext.WeatherSnapshots.Add(snapshot);
        _dbContext.SearchLogs.Add(searchLog);
        await _dbContext.SaveChangesAsync();

        return Ok(weather);
    }

    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<HistoryItemDto>>> History([FromQuery] string? city = null)
    {
        var query = _dbContext.WeatherSnapshots
            .Include(ws => ws.City)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(city))
        {
            query = query.Where(ws => ws.City != null && ws.City.Name == city);
        }

        var history = await query
            .OrderByDescending(ws => ws.RecordedAt)
            .Take(20)
            .Select(ws => new HistoryItemDto
            {
                City = ws.City!.Name,
                Country = ws.City!.Country,
                TemperatureC = ws.TemperatureC,
                WindSpeed = ws.WindSpeed,
                WeatherCode = ws.WeatherCode,
                RecordedAt = ws.RecordedAt
            })
            .ToListAsync();

        return Ok(history);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<IEnumerable<CityStatsDto>>> Stats()
    {
        var stats = await _dbContext.SearchLogs
            .Include(sl => sl.City)
            .GroupBy(sl => sl.City!.Name)
            .Select(g => new CityStatsDto
            {
                City = g.Key,
                SearchCount = g.Count()
            })
            .OrderByDescending(x => x.SearchCount)
            .Take(5)
            .ToListAsync();

        return Ok(stats);
    }
}