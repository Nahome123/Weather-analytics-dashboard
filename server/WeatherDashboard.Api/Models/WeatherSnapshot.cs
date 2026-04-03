namespace WeatherDashboard.Api.Models;

public class WeatherSnapshot
{
    public int Id { get; set; }
    public int CityId { get; set; }
    public double TemperatureC { get; set; }
    public double WindSpeed { get; set; }
    public int WeatherCode { get; set; }
    public DateTime RecordedAt { get; set; }

    public City? City { get; set; }
}