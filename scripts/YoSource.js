// Data source of Yo messages
class YoSource {
  // Obtains a random Yo
  async getRandomYo() {
    return { from: 'Alice', to: 'Bob' };
  }
}
