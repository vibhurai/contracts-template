# < Application name >

A small description.

## Contract
(Contract methods with parameters and its types)
  
  Example:
  
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

1. Clone this repo locally.
2. Run `yarn` to install dependencies.
3. Run `yarn dev-dep` to deploy the contract (this uses `near dev-deploy`).
4. Run `export CONTRACT=<the ID of your dev account>`.
5. You can also deploy the contract to a specified account by using `yarn dep`.

**Your contract is now ready to use.**

To use the contract you can do any of the following:

_Public commands_

- Command description

  ```sh
  near call $CONTRACT <function name> <'{"key": "value>"}'> --accountId <your account ID>
  ```

_Owner commands_

- Command description

  ```sh
  near call $CONTRACT <function name> <'{"key": "value>"}'> --accountId <your account ID>
  ```
