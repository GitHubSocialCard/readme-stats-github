import getData from "../helper/getData";
import template from "../helper/template";
import { themes } from "../../themes/index";

export type UiConfig = {
  titleColor: string;
  textColor: string;
  iconColor: string;
  borderColor: string;
  strokeColor: string;
  usernameColor: string;
  bgColor: string;
};

export default async function readmeStats(req: any, res: any): Promise<any> {
  try {
    let username = req.query.username;

    const fallbackTheme = "default";
    const defaultTheme = themes[fallbackTheme];
    const selectTheme = themes[req.query.theme] || defaultTheme;

    let uiConfig: UiConfig = {
      titleColor: req.query.title_color || selectTheme.title_color || defaultTheme.title_color,
      textColor: req.query.text_color || selectTheme.text_color || defaultTheme.text_color,
      iconColor: req.query.icon_color || selectTheme.icon_color || defaultTheme.icon_color,
      borderColor: req.query.border_color || selectTheme.border_color || defaultTheme.border_color,
      strokeColor: req.query.stroke_color || selectTheme.stroke_color || selectTheme.border_color || defaultTheme.border_color,
      usernameColor: req.query.username_color || selectTheme.username_color || selectTheme.text_color || defaultTheme.text_color,
      bgColor: req.query.bg_color || selectTheme.bg_color || defaultTheme.bg_color,
    };

    if (!username) throw new Error("Username is required");

    var fetchStats = await getData(username);
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");

    if (req.query.format === "json") {
      res.json(fetchStats);
    } else {
      res.setHeader("Content-Type", "image/svg+xml");
      let svg = template(fetchStats, uiConfig);
      res.send(svg);
    }
  } catch (error: any) {
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(500).send(error.message);
  }
}
