# Notes

A simple note taking contract with the basic CRUD operations and an option to share a note with another account on the network

## Contract

```ts
// ====================================
// CONTRACT INITIALISATION
// ====================================

/**
 * initialize contract with owner ID and other config data
 *
 * (note: this method is called "constructor" in the singleton contract code)
 */
function init(master: AccountId): void

// ====================================
// PUBLIC METHODS
// ====================================

/**
 * give thanks to the owner of the contract
 * @Params and optionally attach tokens
 */
function create(note: string): bool

/**
 * Edit a note
 *    @Params
 *    content: partial content of the note to be edited
 *    note: the new content, either to be appended to the earlier note or to replace the note
 *    append: if the "note" is to replace the previous note or append to it
 */
function edit(content: string, note: string, append: bool): bool

/**
 * Delete a note
 *    @Params
 *    content: partial content of the note to be deleted
 */
function delete(content: string): bool

/**
 * Get an existing note
 *    @Params
 *    content: partial content of the note to be fetched
 */
function get(content: string): Note

/**
 * List all the notes for an account
 */
function list(): Array<Note>

/**
 * Share a note to another account
 *    @Params
 *    target_account_id: the account the note is to be shared to,
 *    content: content of the note to be shared
 */
function shareNote_new(target_account_id: AccountId, content: string): void

// ====================================
// OWNER METHOD(S)
// ====================================

/**
 * Clear the entire database for all users
 */
function clear(): void
```

## Usage

### Development

To deploy the contract for development, follow these steps:

1. clone this repo locally
2. run `yarn` to install dependencies
3. run `yarn dev-dep` to deploy the contract (this uses `near dev-deploy`)
4. run `export CONTRACT=<the ID of your dev account>`
5. you can also deploy the contract to a specified account by using `yarn dep` but first, you would need to initialise a '$CONTRACT' variable with the name of the account the contract would be deployed to

**Your contract is now ready to use.**

To use the contract you can do any of the following:

_Public commands_

- Create a note on the mentioned account ID

```sh
near call $CONTRACT create '{"note": "<string>"}' --accountId <your account ID>
```

- Edit a note on the mentioned account ID

```sh
near call $CONTRACT edit '{"content": "<string>","note": "<string>", "append": true/false}' --accountId <your account ID>
```

- Delete a note on the mentioned account ID

```sh
near call $CONTRACT delete '{"content": "<string>"}' --accountId <your account ID>
```

- Get a note with the mentioned account ID

```sh
near call $CONTRACT get '{"content": "<string>"}' --accountId <your account ID>
```

- Share a note with the mentioned account ID from your account

```sh
near call $CONTRACT shareNote_new '{"target_account_id": "<AccountID>", "content": "<string>"}' --accountId <your account ID>
```

- List all the notes with the mentioned account ID

```sh
near call $CONTRACT list --accountId <your account ID>
```

_Owner commands_

- Initialise the contract with the master

```sh
near call $CONTRACT init '{"master": "'$CONTRACT'"}' --accountId $CONTRACT
```

- Clear the entire database across all accounts

```sh
near call $CONTRACT clear --accountId $CONTRACT
```
