# Yo
A simple example app for Solid, created for educational purposes

## What is Yo?
**Yo is an app to send “yo” messages to people.** That’s all it can do.
I blatantly copied the concept from the existing [Yo](https://www.justyo.co/) mobile app.

However, this app is intended as a step-by-step instruction
on how to build apps on top of the [Solid](https://solid.mit.edu/) platform.

## Where can I test this app?
I made a [public version](http://drive.verborgh.org/public/yo/) available.

## Where do I get an account to log in?
You can register with any Solid server or set up one of your own.
An example server is [solid.community](https://solid.community/).

## What is decentralized about this app?
- The **application and data storage are decoupled**: you can store your list of Yos in a Solid pod of your choice.
- The **list of Yos is stored separately from profiles**: the sender's and recipient's names are retrieved from their store.

In the future, we might want to store every Yo with its creator, and send notifications to the recipient.
But that would make the app a bit more complex, whereas now it is an easy introduction to Solid apps.

## How does the app work?
- The app accesses [an RDF document in the Turtle syntax](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-c7f6d5ea9eddff5344d9627386038c7e), which contains (possibly among other things) a list of Yo messages.
- It [fetches](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R27) and [parses](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R28) this document into an [array of triples](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R29).
- It then searches those triples for “Yo” messages with a sender and a recipient.
  - First, it [select the triples](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R36) that have “Yo” as a summary.
  - Then, [for each of those triples](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R40), we try to find [senders](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R42) and [recipients](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R43) of the same message.
  - Finally, if there is [exactly one sender and one recipient](https://github.com/RubenVerborgh/solid-yo/commit/ca8af361132cd55c6b23ae50c403058001db8d49#diff-71cdbcc76e910448d35274d715048124R46) for the message, we return them.
  - Note in the above steps how we don't make any assumptions about the RDF data: sender or recipient might be missing, or there might be multiple.
- It [tries to find human-readable labels](https://github.com/RubenVerborgh/solid-yo/commit/4284ad87d10ba699a2f2ef24e70ef9544ea565b1#diff-71cdbcc76e910448d35274d715048124R67) for sender and recipient (which are IRIs in the document).
    - It does this by [dereferencing them](https://github.com/RubenVerborgh/solid-yo/commit/4284ad87d10ba699a2f2ef24e70ef9544ea565b1#diff-71cdbcc76e910448d35274d715048124R71), which means retrieving the associated document.
    - Inside of that document, it [looks for the first label for that entity](https://github.com/RubenVerborgh/solid-yo/commit/4284ad87d10ba699a2f2ef24e70ef9544ea565b1#diff-71cdbcc76e910448d35274d715048124R77).
- Adding Yo messages happens by [sending an HTTP `PATCH` request](https://github.com/RubenVerborgh/solid-yo/commit/3e62258ba04387fb05cc87bc5d52c6d1d45582d4#diff-71cdbcc76e910448d35274d715048124R76) with a [SPARQL `UPDATE` query](https://github.com/RubenVerborgh/solid-yo/commit/3e62258ba04387fb05cc87bc5d52c6d1d45582d4#diff-71cdbcc76e910448d35274d715048124R69) as body.
- For `PATCH` to work, the user should be [logged in](https://github.com/RubenVerborgh/solid-yo/commit/1c1d9984fdc8674395f23a58a44ad94ba6f74d33).
    - This is done with the [solid-auth-client](https://github.com/solid/solid-auth-client), which provides an authenticated [`fetch` function](https://github.com/RubenVerborgh/solid-yo/commit/5e669c828572ae6aba66c8d36573d277bad17c9a#diff-eacf331f0ffc35d4b482f1d15a887d3bR50) that the Yo data source uses instead of the default `window.fetch`.
    - The [access control document](https://github.com/RubenVerborgh/solid-yo/commit/343695f49edf78881439b3b57fad7952bfec12f1#diff-8ced908275bb3b3173604fb8a66cd725) explicitly gives [append permissions](https://github.com/RubenVerborgh/solid-yo/commit/343695f49edf78881439b3b57fad7952bfec12f1#diff-8ced908275bb3b3173604fb8a66cd725) to the public.

## How can I use this app to learn about building Solid apps?
Step through all of the commits and see the app grow incrementally.
