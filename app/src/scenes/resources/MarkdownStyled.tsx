import { colors } from "../../utils/colors";
import Markdown from "react-native-markdown-display";

export default function MarkdownStyled({ markdown }: { markdown: string }) {
  return <Markdown style={markdownStyles}>{markdown}</Markdown>;
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
    marginBottom: 4,
  },
  bullet_list: {
    marginBottom: 16,
  },
  strong: {
    fontWeight: "bold" as "bold",
  },
};
