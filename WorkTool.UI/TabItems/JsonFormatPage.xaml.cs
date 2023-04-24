using System.Text.Json;

namespace WorkTool.UI.TabItems;

public partial class JsonFormatPage : ContentPage
{
	public JsonFormatPage()
	{
		InitializeComponent();
    }
    private void Button_Format_Clicked(object sender, EventArgs e)
    {
        try
        {
            using var doc = JsonDocument.Parse(
                editor.Text,
                new JsonDocumentOptions
                {
                    AllowTrailingCommas = true
                }
            );
            MemoryStream memoryStream = new MemoryStream();
            using (
                var utf8JsonWriter = new Utf8JsonWriter(
                    memoryStream,
                    new JsonWriterOptions
                    {
                        Indented = true
                    }
                )
            )
            {
                doc.WriteTo(utf8JsonWriter);
            }
            editor.Text = new System.Text.UTF8Encoding()
                .GetString(memoryStream.ToArray());
        }
        catch (Exception ex)
        {
            DisplayAlert("Error", $"Format error: {ex}", "OK");
        }
    }
}