import { getAgent } from "@/lib/agents/roster";
import type { DissentNote } from "@/lib/types";

export function DissentLog({ notes }: { notes: DissentNote[] }) {
  return (
    <section className="dissent" aria-label="Dissent log">
      <header>
        <h2>Dissent</h2>
        <span>{notes.length === 0 ? "Clear" : `${notes.length} on record`}</span>
      </header>
      {notes.length === 0 ? (
        <p className="quiet">The record is clean.</p>
      ) : (
        <ol>
          {notes.map((note, index) => (
            <li key={`${note.agent}-${index}`}>
              <strong>{getAgent(note.agent).name}</strong>
              <span>{note.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
