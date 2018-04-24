const AS = 'https://www.w3.org/ns/activitystreams#';

const predicates = {
  summary: N3.DataFactory.namedNode(AS + 'summary'),
  actor: N3.DataFactory.namedNode(AS + 'actor'),
  to: N3.DataFactory.namedNode(AS + 'to'),
};
const literals = {
  yo: N3.DataFactory.literal('Yo', 'en'),
};

// Data source of Yo messages
class YoSource {
  // Creates a new Yo source with the given fetcher
  constructor (source, fetch = (...args) => window.fetch(...args)) {
    this._source = source;
    this._fetch = fetch;
  }

  // Obtains all Yo messages
  async getAllYos() {
    // If the Yos have already been fetched, return them
    if (this._yos)
      return this._yos;

    // Fetch and parse the source document
    const document = await this._fetch(this._source);
    const parser = new N3.Parser({ baseIRI: this._source });
    const quads = parser.parse(await document.text());

    // Store the parsed quads into a store, so we can search them
    const store = new N3.Store();
    store.addQuads(quads);

    // Search for all Yo messages
    const messages = store.getQuads(null, predicates.summary, literals.yo);

    // For each Yo message, obtain the sender and recipient
    const yos = this._yos = [];
    messages.forEach(message => {
      // Search the senders and recipients of the message
      const senders = store.getObjects(message.subject, predicates.actor);
      const recipients = store.getObjects(message.subject, predicates.to);

      // If the message has a unique sender and recipient, store it
      if (senders.length === 1 && recipients.length === 1) {
        yos.push({
          from: senders[0].value,
          to: recipients[0].value,
        });
      }
    });
    return yos;
  }

  // Obtains a random Yo
  async getRandomYo() {
    const yos = await this.getAllYos();
    if (yos.length === 0)
      throw new Error('No Yo found.');
    return yos[Math.floor(Math.random() * yos.length)];
  }
}
