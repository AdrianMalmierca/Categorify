const Categoria = {
  name: { type: String, required: true },
  color: { type: String, required: true },
  items: [
      {
          name: { type: String, required: true },
          url: { type: String, required: true },
          description: { type: String },
          imageUrl: { type: String },
          isFavorite: { type: Boolean, default: false }
      }
  ]
};

module.exports = Categoria;