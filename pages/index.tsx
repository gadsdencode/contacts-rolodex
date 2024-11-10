import Head from 'next/head';
    import { useState, useEffect } from 'react';

    interface Contact {
      id: number;
      name: string;
      email: string;
    }

    export default function Home() {
      const [contacts, setContacts] = useState<Contact[]>([]);
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        const storedContacts = localStorage.getItem('contacts');
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        }
      }, []);

      useEffect(() => {
        localStorage.setItem('contacts', JSON.stringify(contacts));
      }, [contacts]);

      const addContact = (name: string, email: string) => {
        const newContact = { id: Date.now(), name, email };
        setContacts([...contacts, newContact]);
      };

      const editContact = (id: number, name: string, email: string) => {
        setContacts(contacts.map(contact => contact.id === id ? { ...contact, name, email } : contact));
      };

      const deleteContact = (id: number) => {
        setContacts(contacts.filter(contact => contact.id !== id));
      };

      const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="min-h-screen bg-gray-100 p-4">
          <Head>
            <title>Contacts Rolodex</title>
            <meta name="description" content="A simple contacts rolodex app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Contacts Rolodex</h1>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <ContactList
              contacts={filteredContacts}
              onEdit={editContact}
              onDelete={deleteContact}
            />
            <AddContactForm onAdd={addContact} />
          </main>
        </div>
      );
    }

    function ContactList({ contacts, onEdit, onDelete }: { contacts: Contact[], onEdit: (id: number, name: string, email: string) => void, onDelete: (id: number) => void }) {
      return (
        <ul>
          {contacts.map(contact => (
            <li key={contact.id} className="flex justify-between items-center p-2 bg-white mb-2 rounded shadow">
              <div>
                <p className="font-bold">{contact.name}</p>
                <p>{contact.email}</p>
              </div>
              <div>
                <button onClick={() => onEdit(contact.id, contact.name, contact.email)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => onDelete(contact.id)} className="text-red-500">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      );
    }

    function AddContactForm({ onAdd }: { onAdd: (name: string, email: string) => void }) {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
          onAdd(name, email);
          setName('');
          setEmail('');
        }
      };

      return (
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 mb-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 mb-2 border rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Contact</button>
        </form>
      );
    }
