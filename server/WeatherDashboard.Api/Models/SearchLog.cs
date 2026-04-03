namespace WeatherDashboard.Api.Models;

public class SearchLog
{
    public int Id { get; set; }
    public int CityId { get; set; }
    public DateTime SearchedAt { get; set; }

    public City? City { get; set; }
}