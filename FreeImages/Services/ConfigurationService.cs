namespace FreeImages.Services;

public class ConfigurationService
{
    public string? ConnectionString { get; set; }

    public static ConfigurationService Load(string name)
    {
        IConfiguration config = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile($"appsettings.Development.json", optional: true).Build();

        return config.GetRequiredSection(name.ToString()).Get<ConfigurationService>() ??
            throw new Exception("Failed. Something has gone wrong!");
    }
}
