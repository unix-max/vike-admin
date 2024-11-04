export interface Elm {
  [key: string]: any,
		id: number,
		oldCode?: number,
		path?: string,
		type?: string,
		name?: string,
		level?: number,
		parent?: Elm,
		parentId?: number,
    in?: [Elm]  
}

export function list2tree <T extends Elm>( list: T[]): Array<T> {
  const elmCat: {[key: string]: any }= {};
  const elmTree: T[] = [];

  list.forEach(function(elm, index, arr) {

   
    const parentId = elm.parentid;
 
    if (elm.id) elmCat[elm.id] = elm;
    if (parentId) { 
        const parent = elmCat[parentId];          
        if (parent.in) {
            parent.in.push(elm);
        } else {
            parent.in = [elm];
        }
        
    } else {
        elmTree.push(elm);
    }
  });
 
  return elmTree;
}