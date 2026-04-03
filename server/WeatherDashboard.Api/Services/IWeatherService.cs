using WeatherDashboard.Api.Dtos;

namespace WeatherDashboard.Api.Services;

public interface IWeatherService
{
    Task<WeatherResponseDto?> GetWeatherAsync(GeocodingResult location);
}