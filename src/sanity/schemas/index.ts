import type { SchemaTypeDefinition } from 'sanity'
import { department } from './department'
import { teamMember } from './teamMember'
import { partner } from './partner'

/**
 * Everything the Studio knows how to edit.
 *
 * Departments, team members and partners — the rest of the site still reads
 * from `src/data`. To bring another kind of content across later (updates,
 * mission milestones), add a file next to these and list it here. Nothing
 * else in the Studio has to change.
 */
export const schemaTypes: SchemaTypeDefinition[] = [department, teamMember, partner]
