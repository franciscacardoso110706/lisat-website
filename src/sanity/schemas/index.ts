import type { SchemaTypeDefinition } from 'sanity'
import { department } from './department'
import { teamMember } from './teamMember'

/**
 * Everything the Studio knows how to edit.
 *
 * Only departments and team members for now — the rest of the site still
 * reads from `src/data`. To bring another kind of content across later
 * (updates, partners, mission milestones), add a file next to these two and
 * list it here. Nothing else in the Studio has to change.
 */
export const schemaTypes: SchemaTypeDefinition[] = [department, teamMember]
