let artworks = [];
const fs = require("fs");
async function main() {
  try {
    const ids = await fetchAbstractPaintings();
    const artworksDetails = await Promise.all(
      ids.map((id) => fetchPaintingDetails(id))
    );
    artworks = artworksDetails.filter((artwork) => artwork !== null);
    fs.writeFileSync("artworks.json", JSON.stringify(artworks));
  } catch (error) {
    console.log(error);
  }
}

main();

async function fetchAbstractPaintings() {
  const url =
    "https://api.artic.edu/api/v1/artworks/search?q=abstract-painting-geometry%20&%20query[term][is_public_domain]=true";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("HTTP error! status:", response.status);
    }
    const data = await response.json();

    return data.data.map((artwork) => artwork.id);
  } catch (error) {
    console.error("Error fetching abstract paintings:", error);
    return [];
  }
}

async function fetchPaintingDetails(id) {
  const url = `https://api.artic.edu/api/v1/artworks/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("HTTP error! status:", response.status);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching painting details for ID ${id}:`, error);
    return null;
  }
}
