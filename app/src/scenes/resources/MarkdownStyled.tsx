import { colors } from "../../utils/colors";
import Markdown from "react-native-markdown-display";
import { useNavigation } from "@react-navigation/native";
import { CATEGORIES, RESOURCES_DATA } from "./data/resources";
import { Linking } from "react-native";

export default function MarkdownStyled({ markdown }: { markdown: string }) {
  const navigation = useNavigation();

  // Replace the target string with a markdown link
  // const processedMarkdown = markdown.replace(/Agir et chercher de l’aide sans honte/g, "[Agir et chercher de l’aide sans honte](ressource-5)");

  return (
    <Markdown
      style={markdownStyles}
      onLinkPress={async (url) => {
        if (url === "ressource-2") {
          navigation.push("resource-category-list", { category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE });
          return true;
        } else if (url === "ressource-5") {
          navigation.push("resource-category-list", { category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE });
          return true;
        } else if (url === "ressource-article-14") {
          navigation.push("resource-article", { resource: RESOURCES_DATA.find((res) => res.matomoId === 14) });
          return true;
        } else if (url === "ressource-article-16") {
          navigation.push("resource-article", { resource: RESOURCES_DATA.find((res) => res.matomoId === 16) });
          return true;
        } else if (url === "tools") {
          navigation.push("tool-screen");
          return true;
        } else if (url === "crisis-plan") {
          navigation.push("crisis-plan");
          return true;
        }
        Linking.openURL(url);
        return true;
      }}
    >
      {markdown}
    </Markdown>
  );
}

const markdownStyles = {
  body: {
    fontFamily: "SourceSans3",
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  heading2: {
    fontFamily: "SourceSans3",
    fontSize: 18,
    fontWeight: "600" as "600",
    color: colors.BLUE,
    marginTop: 20,
    marginBottom: 12,
    lineHeight: 24,
  },
  heading3: {
    fontFamily: "SourceSans3",
    fontSize: 16,
    fontWeight: "600" as "600",
    color: colors.BLUE,
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 20,
  },
  paragraph: {
    fontFamily: "SourceSans3",
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  list_item: {
    fontFamily: "SourceSans3",
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  bullet_list: {
    marginBottom: 16,
  },
  strong: {
    fontWeight: "bold" as "bold",
    fontFamily: "SourceSans3-Bold",
  },
};
