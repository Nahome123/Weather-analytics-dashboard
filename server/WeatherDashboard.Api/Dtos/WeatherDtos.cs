namespace WeatherDashboard.Api.Dtos;

public class WeatherResponseDto
{
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public CurrentWeatherDto Current { get; set; } = new();
    public DailyForecastDto Forecast { get; set; } = new();
}

public class CurrentWeatherDto
{
    public double Temperature { get; set; }
    public double WindSpeed { get; set; }
    public int WeatherCode { get; set; }
    public string Time { get; set; } = "";
}

public class DailyForecastDto
{
    public List<string> Dates { get; set; } = new();
    public List<double> MaxTemperatures { get; set; } = new();
    public List<double> MinTemperatures { get; set; } = new();
}

public class HistoryItemDto
{
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public double TemperatureC { get; set; }
    public double WindSpeed { get; set; }
    public int WeatherCode { get; set; }
    public DateTime RecordedAt { get; set; }
}

public class CityStatsDto
{
    public string City { get; set; } = "";
    public int SearchCount { get; set; }
}