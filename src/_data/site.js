const PRODUCTION_URL = "https://aurus-website.netlify.app";

function normalizeUrl(value) {
return String(value || "").trim().replace(/\/+$/, "");
}

function normalizeAssetPath(value) {
const normalized = normalizeUrl(value);

if (!normalized || normalized === "/") {
return "";
}

return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

module.exports = function() {
const deployUrl = normalizeUrl(process.env.URL || process.env.DEPLOY_PRIME_URL);

return {
name: "Aurus Impact Capital",
url: deployUrl || PRODUCTION_URL,
assetPath: normalizeAssetPath(process.env.ASSET_PATH),
authorName: "Andy Clarke",
authorEmail: "andy.clarke@stuffandnonsense.co.uk",
telephone: "+44 07515 395903",
email: "andy.clarke@stuffandnonsense.co.uk",
siteID: "aurus-impact-capital",
copyrightOwner: "Aurus Impact Capital"
};
};
