
import { Note, Vector } from './models'
import { Context, logging } from "near-sdk-core"
import { AccountId } from '../../utils';

@nearBindgen
export class Contract {
  private owner: AccountId;

  constructor(master: AccountId) {
    this.owner = master;
  }
  ret(): AccountId {
    return this.owner;
  }

  @mutateState()
  create(note: string): bool {
    this.assert_owner();
    let temp = new Note();
    temp.edit(note, false);

    notes.pushBack(temp);
    return true;
  }

  @mutateState()
  edit(content: string, note: string, append: bool): bool {
    this.assert_owner();
    let a = "string";

    for (let i = 0; i < notes.length; i++) {
      if (notes[i].get() == content) {
        if (append)
          notes[i].edit(note, true);
        else
          notes[i].edit(note, false);
      }
    }

    return true;
  }

  @mutateState()
  delete(content: string): bool {
    this.assert_owner();

    for (let i = 0; i < notes.length; i++) {
      if (notes[i].get() == content)
        notes.swap_remove(i);
    }

    return true;
  }

  @mutateState()
  clear(): void {
    this.assert_owner();

    while (notes.length > 0)
      notes.pop();
  }

  list(): Array<string> {
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
    const caller = Context.predecessor;
    assert(
      this.owner == caller,
      'Only the owner of this contract may call this method'
    );
  }


}

const notes: Vector<Note> = new Vector<Note>("n");