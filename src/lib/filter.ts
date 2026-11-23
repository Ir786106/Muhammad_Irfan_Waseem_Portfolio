export function matchesProject(project: {title:string;description:string;tags:string[];category:string}, query:string, category:string) {
 return (category === 'all' || project.category.split(' ').includes(category)) && `${project.title} ${project.description} ${project.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase());
}
