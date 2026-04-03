namespace WeatherDashboard.Api.Models;

public class City
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Country { get; set; } = "";
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public ICollection<WeatherSnapshot> WeatherSnapshots { get; set; } = new List<WeatherSnapshot>();
    public ICollection<SearchLog> SearchLogs { get; set; } = new List<SearchLog>();
}