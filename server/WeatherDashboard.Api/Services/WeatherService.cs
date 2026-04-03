using System.Text.Json;
using WeatherDashboard.Api.Dtos;

namespace WeatherDashboard.Api.Services;

public class WeatherService : IWeatherService
{
    private readonly HttpClient _httpClient;

    public WeatherService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<WeatherResponseDto?> GetWeatherAsync(GeocodingResult location)
    {
        var url =
            $"https://api.open-meteo.com/v1/forecast?latitude={location.Latitude}&longitude={location.Longitude}" +
            $"&current=temperature_2m,wind_speed_10m,weather_code" +
            $"&daily=temperature_2m_max,temperature_2m_min&timezone=auto";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();

        var data = JsonSerializer.Deserialize<ForecastApiResponse>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (data == null || data.Current == null || data.Daily == null)
            return null;

        return new WeatherResponseDto
        {
            City = location.Name,
            Country = location.Country,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            Current = new CurrentWeatherDto
            {
                Temperature = data.Current.Temperature2m,
                WindSpeed = data.Current.WindSpeed10m,
                WeatherCode = data.Current.WeatherCode,
                Time = data.Current.Time ?? ""
            },
            Forecast = new DailyForecastDto
            {
                Dates = data.Daily.Time ?? new List<string>(),
                MaxTemperatures = data.Daily.Temperature2mMax ?? new List<double>(),
                MinTemperatures = data.Daily.Temperature2mMin ?? new List<double>()
            }
        };
    }

    private class ForecastApiResponse
    {
        public ForecastCurrent? Current { get; set; }
        public ForecastDaily? Daily { get; set; }
    }

    private class ForecastCurrent
    {
        public string? Time { get; set; }
        public double Temperature2m { get; set; }
        public double WindSpeed10m { get; set; }
        public int WeatherCode { get; set; }
    }

    private class ForecastDaily
    {
        public List<string>? Time { get; set; }
        public List<double>? Temperature2mMax { get; set; }
        public List<double>? Temperature2mMin { get; set; }
    }
}