import getData from "../helper/getData";
import template from "../helper/template";

export type UiConfig = {
  title_color: string;
  text_color: string;
  icon_color: string;
  border_color: string;
  bg_color: string;
};

export default async function readmeStats(req: any, res: any): Promise<any> {
  try {
    let username = req.query.username;

    let uiConfig: UiConfig = {
      title_color: req.query.title_color || "000000",
      text_color: req.query.text_color || "000000",
      icon_color: req.query.icon_color || "FF0000",
      border_color: req.query.border_color || "7E7979",
      bg_color: req.query.bg_color || "FFFFFF",
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
