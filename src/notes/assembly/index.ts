import { Note } from './modules'
import { Context, logging, PersistentSet } from "near-sdk-as"
import { AccountId } from '../../utils';
import { Vector, Set } from './ds_utils';

@nearBindgen
export class Contract {
  private owner: AccountId;
  private accounts: Set<AccountId> = new Set<AccountId>("p");


  constructor(master: AccountId) {
    this.owner = master;
    this.accounts.add(master);
    logging.log(this.accounts.size)
  }

  ret(): number {
    return this.accounts.size;
  }

  @mutateState()
  create(note: string): bool {
    this.assert_owner();

    let temp = new Note();
    temp.edit(note, notes.length, false);

    notes.pushBack(temp);
    return true;
  }

  @mutateState()
  edit(content: string, note: string, append: bool): bool {
    this.assert_owner();

    let a = "string";
    let i = 0;

    for (i; i < notes.length; i++) {
      if (notes[i].get_content().includes(content)) {
        if (append)
          notes[i].edit(note, -1, true);
        else
          notes[i].edit(note, -1, false);
        break;
      }
    }

    // Note not found
    if (i != notes.length)
      return true;

    return false;
  }

  @mutateState()
  delete(content: string): bool {
    this.assert_owner();

    for (let i = 0; i < notes.length; i++) {
      if (notes[i].get_content() == content)
        notes.swap_remove(i);
    }

    return true;
  }

  // Clears all the notes
  @mutateState()
  clear(): void {
    this.assert_owner();

    while (notes.length > 0)
      notes.pop();
  }

  @mutateState()
  add_caller(account: AccountId): void {
    this.assert_owner();
    logging.log("here");
    this.accounts.add(account);
  }

  list(): Array<Note> {
    this.assert_owner();
    return notes.get_all();
  }

  get(content: string): Note {
    this.assert_owner();
    return notes.get_one(content);
  }

  // --------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------

  private assert_owner(): void {
    // let caller = Context.sender;
    let t = true;
    assert(
      // this.accounts.has(Context.sender),
      t == true,
      'Only the owner of this contract may call this method'
    );
  }


}

const notes: Vector<Note> = new Vector<Note>("n");