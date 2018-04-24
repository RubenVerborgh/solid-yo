const AS = 'https://www.w3.org/ns/activitystreams#';
const RDFS = 'http://www.w3.org/2000/01/rdf-schema#';

const predicates = {
  summary: N3.DataFactory.namedNode(AS + 'summary'),
  actor: N3.DataFactory.namedNode(AS + 'actor'),
  to: N3.DataFactory.namedNode(AS + 'to'),
  label: N3.DataFactory.namedNode(RDFS + 'label'),
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
    const document = await this._fetch(this._source, {
      headers: { 'Accept': 'text/turtle' },
    });
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
          from: this._getLabel(senders[0]),
          to: this._getLabel(recipients[0]),
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

  // Adds a Yo to the source
  async addYo({ from, to }) {
    // Create the SPARQL UPDATE query
    const query = `
      INSERT DATA {
        [] <${AS}actor>   <${this._escape(from)}>;
           <${AS}to>      <${this._escape(to)}>;
           <${AS}summary> "Yo"@en.
      }`
    // Send a PATCH request to update the source
    const response = await this._fetch(this._source, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/sparql-update' },
      body: query,
      credentials: 'include',
    });
    return response.status === 200;
  }

  // Obtains a label for the given entity
  async _getLabel(entity) {
    // Try dereferencing the entity to obtain its label
    try {
      // Retrieve and parse the document
      const document = await this._fetch(entity.value, {
        headers: { 'Accept': 'text/turtle' },
      });
      const parser = new N3.Parser({ baseIRI: entity.value });
      const quads = parser.parse(await document.text());

      // Find the first label for the subject
      const label = quads.find(q =>
        q.subject.equals(entity) && q.predicate.equals(predicates.label));

      // Return the label or the entity's IRI
      return label ? label.object.value : entity.value;
    }
    // In case of errors, return the entity's IRI
    catch (error) {
      return entity.value;
    }
  }

  // Escapes the IRI for use in a SPARQL query
  _escape (iri) {
    // More of a sanity check, really
    if (!iri || !/^\w+:[^<> ]+$/.test(iri))
      throw new Error(`Invalid IRI: ${iri}`);
    return iri;
  }
}
