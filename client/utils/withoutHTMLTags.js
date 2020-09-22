const withoutHTMLTags = (string) => string.replace(/<[^>]*>/g, "");

export default withoutHTMLTags;
