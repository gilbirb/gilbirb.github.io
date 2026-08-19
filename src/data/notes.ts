export interface Note {
  slug: string;
  title: string;
}

export interface NoteSection {
  /** URL prefix shared by every note in this section, no trailing slash. */
  base: string;
  notes: Note[];
}

/**
 * Reading order for each course. Course index pages render their list from
 * here, and Layout.astro derives the prev/next buttons from the same order.
 */
export const sections: NoteSection[] = [
  {
    base: '/courses/comp2511',
    notes: [
      { slug: 'design-by-contract', title: 'Design by Contract' },
      { slug: 'code-smells', title: 'Code Smells' },
      { slug: 'design-patterns', title: 'Design Patterns' },
      { slug: 'design-principles', title: 'Design Principles' },
      { slug: 'software-architecture', title: 'Software Architecture' },
    ],
  },
  {
    base: '/courses/comp2521',
    notes: [
      { slug: 'sorting', title: 'Sorting' },
      { slug: 'bst', title: 'Binary Search Trees' },
      { slug: 'graphs', title: 'Graphs' },
      { slug: 'graph-algorithms', title: 'Graph Algorithms' },
      { slug: 'hash-tables', title: 'Hash Tables' },
      { slug: 'priority-queues', title: 'Priority Queues' },
      { slug: 'tries', title: 'Tries' },
    ],
  },
  {
    base: '/courses/comp3231',
    notes: [
      { slug: 'os-overview', title: 'Operating Systems Overview' },
      { slug: 'process-threads', title: 'Processes & Threads' },
      { slug: 'concurrency-synchronisation', title: 'Concurrency & Synchronisation' },
      { slug: 'syscalls', title: 'System Calls' },
      { slug: 'mips-r3000', title: 'MIPS R3000' },
      { slug: 'process-threads-continued', title: 'Process & Threads Continued' },
      { slug: 'deadlocks', title: 'Deadlocks' },
      { slug: 'file-system-interface', title: 'File System Interface' },
      { slug: 'file-system-implementation', title: 'File System Implementation' },
      { slug: 'virtual-file-systems', title: 'Virtual File System' },
      { slug: 'buffering-caching-consistency', title: 'Buffering, Caching, and Consistency' },
      { slug: 'memory-management', title: 'Memory Management' },
      { slug: 'multiprocessor-systems', title: 'Multiprocessor Systems' },
    ],
  },
  {
    base: '/courses/comp3231/tutorials',
    notes: [
      { slug: 'wk03', title: 'Week 3' },
      { slug: 'wk04', title: 'Week 4' },
      { slug: 'wk05', title: 'Week 5' },
      { slug: 'wk07', title: 'Week 7' },
    ],
  },
  {
    base: '/courses/comp6771',
    notes: [{ slug: 'class-types', title: 'Class Types' }],
  },
  {
    base: '/courses/comp6991',
    notes: [
      { slug: 'rust', title: 'The Rust Programming Language' },
      { slug: 'rust-basics', title: 'Rust Basics' },
      { slug: 'ownership-borrowing', title: 'Ownership and Borrowing' },
      { slug: 'lifetimes-smart-pointers', title: 'Lifetimes and Smart Pointers' },
      { slug: 'generics-traits-polymorphism', title: 'Generics, Traits & Polymorphism' },
      { slug: 'metaprogramming-macros', title: 'Metaprogramming & Macros' },
      { slug: 'concurrency', title: 'Concurrency' },
      { slug: 'unsafe-rust', title: 'Unsafe Rust' },
    ],
  },
];

export function getNotes(base: string): Note[] {
  return sections.find((section) => section.base === base)?.notes ?? [];
}

export interface Neighbours {
  prev?: Note & { href: string };
  next?: Note & { href: string };
}

/**
 * Find the previous/next note for a page path such as
 * "/courses/comp3231/syscalls/". Returns an empty object for non-note pages.
 */
export function getNeighbours(pathname: string): Neighbours {
  const path = pathname.replace(/\/+$/, '');
  const base = path.slice(0, path.lastIndexOf('/'));
  const section = sections.find((s) => s.base === base);
  if (!section) return {};

  const slug = path.slice(base.length + 1);
  const index = section.notes.findIndex((note) => note.slug === slug);
  if (index === -1) return {};

  const link = (note: Note) => ({ ...note, href: `${base}/${note.slug}` });
  return {
    prev: index > 0 ? link(section.notes[index - 1]) : undefined,
    next: index < section.notes.length - 1 ? link(section.notes[index + 1]) : undefined,
  };
}
