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

## How can I use this app to learn about building Solid apps?
Step through all of the commits and see the app grow incrementally.
