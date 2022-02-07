import { logging, PersistentUnorderedMap, PersistentVector } from 'near-sdk-as';
import { AccountId } from '../../utils';

@nearBindgen
export class Note {

  public id: number;
  public shared_by: AccountId;
  public content: string;

  edit(note: string, id: number, append: bool = false): void {
    if (append) {
      this.content += (note);
      logging.log("true " + this.content);
    } else {
      this.content = note;

      // New ID has been passed
      if (id > -1)
        this.id = id;

      logging.log("false " + this.content);
    }

    logging.log(id);
  }

  set_share(shared_by: AccountId): void {
    this.shared_by = shared_by;
  }

  get_content(): string {
    return this.content;
  }
}

export let notes = new PersistentUnorderedMap<AccountId, Array<Note>>("map")

