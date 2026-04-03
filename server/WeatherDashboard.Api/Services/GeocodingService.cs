using System.Text.Json;

namespace WeatherDashboard.Api.Services;

public class GeocodingService : IGeocodingService
{
    private readonly HttpClient _httpClient;

    public GeocodingService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<GeocodingResult?> SearchCityAsync(string cityName)
    {
        var url =
            $"https://geocoding-api.open-meteo.com/v1/search?name={Uri.EscapeDataString(cityName)}&count=1&language=en&format=json";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();

        var data = JsonSerializer.Deserialize<GeocodingApiResponse>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        var first = data?.Results?.FirstOrDefault();
        if (first == null) return null;

        return new GeocodingResult
        {
            Name = first.Name ?? "",
            Country = first.Country ?? "",
            Latitude = first.Latitude,
            Longitude = first.Longitude
        };
    }

    private class GeocodingApiResponse
    {
        public List<GeocodingApiItem>? Results { get; set; }
    }

    private class GeocodingApiItem
    {
        public string? Name { get; set; }
        public string? Country { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}