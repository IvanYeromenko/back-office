import {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps,
} from "next/document";
import {
  createEmotionCache,
  DocumentHeadTags,
  DocumentHeadTagsProps,
  documentGetInitialProps,
} from "@mui/material-nextjs/v15-pagesRouter";

export default function MyDocument(
  props: DocumentProps & DocumentHeadTagsProps
) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx, {
    emotionCache: createEmotionCache({ key: "mui", enableCssLayer: true }),
  });
  return finalProps;
};
