import { Context, ContractPromiseBatch, logging, u128 } from "near-sdk-core"
import { AccountId, XCC_GAS, assert_self, assert_single_promise_success } from "../../utils"
import { Message, ContributionTracker, Vector } from "./models"

@nearBindgen
export class Contract {
  private owner: AccountId
  private allow_anonymous: bool
  private contributions: ContributionTracker = new ContributionTracker()

  constructor(owner: AccountId, allow_anonymous: bool = true) {
    this.owner = owner
    this.allow_anonymous = allow_anonymous
  }

  @mutateState()
  say(message: string, anonymous: bool = false): bool {
    assert(message.length > 0, "Message length cannot be 0")
    assert(message.length < Message.max_length(), "Message length is too long, must be less than " + Message.max_length().toString() + " characters.")

    if (!this.allow_anonymous) {
      assert(!anonymous, "Anonymous messages are not allowed by this contract")
    }

    const contribution = Context.attachedDeposit

    if (contribution > u128.Zero) {
      this.contributions.update(contribution)
    }

    messages.pushBack(new Message(message, anonymous, contribution))
    return true
  }

  // ----------------------------------------------------------------------------
  // OWNER methods
  // ----------------------------------------------------------------------------

  list(): Array<Message> {
    this.assert_owner()
    return messages.get_last(10)
  }

  @mutateState()
  summarize(): Contract {
    this.assert_owner()
    return this
  }

  transfer(): void {
    this.assert_owner()

    assert(this.contributions.received > u128.Zero, "No received (pending) funds to be transferred")

    const to_self = Context.contractName
    const to_owner = ContractPromiseBatch.create(this.owner)

    // transfer earnings to owner then confirm transfer complete
    const promise = to_owner.transfer(this.contributions.received)
    promise.then(to_self).function_call("on_transfer_complete", '{}', u128.Zero, XCC_GAS)
  }

  @mutateState()
  on_transfer_complete(): void {
    assert_self()
    assert_single_promise_success()

    logging.log("transfer complete")
    // reset contribution tracker
    this.contributions.record_transfer()
  }

  // --------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------

  private assert_owner(): void {
    const caller = Context.predecessor
    assert(this.owner == caller, "Only the owner of this contract may call this method")
  }

}


/**
 * TODO: resolve this issue
 *
 * when `messages` is added as a private member of the Contract, this error is thrown on build
 *
 * ERROR TS2322: Type '~lib/near-sdk-core/collections/persistentVector/PersistentVector<src/sample/assembly/models/Message
 * >' is not assignable to type 'src/sample/assembly/models/Vector<src/sample/assembly/models/Message>'.
 */
const messages: Vector<Message> = new Vector<Message>("m")