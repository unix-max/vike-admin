export const fetcher = async (url:string) => fetch(url).then(r => r.json());

export type newDataType = {[key: string]: any};
export type sendDataPropsType = {
    url: string;
    id?: number;
    parentId?: number | string;
    type?: string;

}
export const useDataSend= async (newData: newDataType, props: sendDataPropsType):Promise<newDataType> => {
    console.log(newData);
    let data:newDataType = {};
      if (Object.keys(newData, ).length != 0) {
          const requestOptions: RequestInit = {
                  headers: { 'Content-Type': 'application/json' },
          };

          if (props.id ==0) {
              requestOptions.method = 'POST';
              console.log(props.parentId)
              newData['id'] = props.parentId;
              newData['type'] = props.type;
          } else {
              requestOptions['method'] = 'PUT'
              newData['id'] = props.id;
                  
          }
          
          requestOptions['body'] = JSON.stringify(newData);
          try {
            const response = await fetch(props.url, requestOptions);
             data = response.json()
          //console.log(data);

          }
          catch(err:any) {
            console.error(err);
            return err;
          }
          
  }
  return data;
}
