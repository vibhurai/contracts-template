import { Note, notes } from './modules'
import { Context, logging, PersistentSet } from "near-sdk-as"
import { AccountId } from '../../utils';

@nearBindgen
export class Contract {
  private owner: AccountId;

  constructor(master: AccountId) {
    this.owner = master;
  }

  ret(): void {
    logging.log(Context.sender + " " + Context.predecessor);

  }

  @mutateState()
  create(note: string): bool {
    let note_bucket = notes.get(Context.sender);
    let new_note = new Note();

    if (note_bucket == null) {
      logging.log("here");
      let notesArray = new Array<Note>();
      new_note.edit(note, 0, false);

      notesArray.push(new_note);
      notes.set(Context.sender, notesArray);
    }
    else {
      new_note.edit(note, note_bucket.length, false);
      note_bucket.push(new_note);
      notes.set(Context.sender, note_bucket);
    }

    return true;
  }

  @mutateState()
  shareNote_new(target_account_id: AccountId, content: string): void {
    const note_bucket = notes.get(target_account_id);
    const new_note = new Note();

    if (note_bucket == null) {
      const notesArray = new Array<Note>();
      new_note.edit(content, 0, false);
      new_note.set_share(Context.predecessor);

      notesArray.push(new_note);
      notes.set(target_account_id, notesArray);
    }
    else {
      new_note.edit(content, note_bucket.length, false);
      new_note.set_share(Context.predecessor);

      note_bucket.push(new_note);
      notes.set(target_account_id, note_bucket);
    }
  }

  @mutateState()
  edit(content: string, note: string, append: bool): bool {
    const note_bucket = notes.get(Context.sender);

    let i = 0;

    if (note_bucket != null) {
      for (i; i < note_bucket.length; i++) {
        if (note_bucket[i].get_content().includes(content)) {
          if (append)
            note_bucket[i].edit(note, -1, true);
          else
            note_bucket[i].edit(note, -1, false);
          break;
        }
      }

      notes.set(Context.sender, note_bucket);

      // Note found
      if (i != note_bucket.length)
        return true;
    }

    return false;
  }

  @mutateState()
  delete(content: string): bool {
    const note_bucket = notes.get(Context.sender);

    let i = 0;

    if (note_bucket != null) {
      for (i; i < note_bucket.length; i++) {
        if (note_bucket[i].get_content().includes(content)) {
          note_bucket.splice(i, 1);
          notes.set(Context.sender, note_bucket);

          return true;
        }
      }
    }

    return false;
  }

  // Clears the database 
  @mutateState()
  clear(): void {
    this.assert_owner();
    notes.clear()
  }


  list(): Array<Note> {
    const note_bucket = notes.get(Context.sender);

    if (note_bucket != null) {
      return note_bucket;
    }

    let temp = new Array<Note>();

    return temp;
  }

  get(content: string): Note {
    const note_bucket = notes.get(Context.sender);

    let i = 0;

    if (note_bucket != null) {
      for (i; i < note_bucket.length; i++) {
        if (note_bucket[i].get_content().includes(content))
          return note_bucket[i];
      }
    }

    return new Note();
  }

  // --------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------

  private assert_owner(): void {
    assert(
      Context.sender == this.owner,
      'Only the owner of this contract may call this method'
    );
  }
}