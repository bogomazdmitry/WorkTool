namespace WorkTool.UI.TabItems;

public partial class TextFormatPage : ContentPage
{
	public TextFormatPage()
	{
		InitializeComponent();
        editor.Text ??= "";

    }

    private void Button_Upper_Clicked(object sender, EventArgs e)
    {
        editor.Text = editor.Text.ToUpper();
    }

    private void Button_Lower_Clicked(object sender, EventArgs e)
    {
        editor.Text = editor.Text.ToLower();
    }

    private void Button_Invert_Clicked(object sender, EventArgs e)
    {
        char[] chars = editor.Text.ToCharArray();
        for (int i = 0; i < chars.Length; i++)
        {
            if (char.IsLower(chars[i]))
            {
                chars[i] = char.ToUpper(chars[i]);
            }
            else if (char.IsUpper(chars[i]))
            {
                chars[i] = char.ToLower(chars[i]);
            }
        }
        editor.Text =  new string(chars);
    }
}