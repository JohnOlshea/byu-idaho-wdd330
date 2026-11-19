const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // The API searches by category, so query every category and match on name.
  async searchProducts(term) {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const results = await Promise.allSettled(
      categories.map(async (category) => {
        const list = await this.getData(category);
        return list.map((product) => ({ ...product, _category: category }));
      })
    );
    const lists = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
    if (lists.length === 0) throw new Error("Search request failed");

    const query = term.trim().toLowerCase();
    return lists.flat().filter((p) => p.Name.toLowerCase().includes(query));
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${baseURL}checkout`, options);
    const data = await convertToJson(response);
    return data;
  }
}