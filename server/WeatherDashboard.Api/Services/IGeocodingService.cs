namespace WeatherDashboard.Api.Services;

public interface IGeocodingService
{
    Task<GeocodingResult?> SearchCityAsync(string cityName);
}

public class GeocodingResult
{
    public string Name { get; set; } = "";
    public string Country { get; set; } = "";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}