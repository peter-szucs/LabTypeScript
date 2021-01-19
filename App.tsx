import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface shoppingItem {
  id: number,
  title: string,
  price: number,
  description?: string,
  image: string
}

type listItemProps = {
  item: shoppingItem,
  index: number,
  //setIndex: number,

}

const CatalogList = (props:{ data: shoppingItem[] }) => {
  
  const [selected, setSelected] = useState(-1)
  
  return ( 
    <SafeAreaView style={{ width: '100%', justifyContent: 'space-evenly' }}>
      <View>
      <FlatList
        style={{backgroundColor: '#f2f2f2', padding: 10}}
        data={props.data}
        renderItem={({ item, index }) => 
          <ItemComponent 
            item={item} 
            index={index} 
            //setIndex={setSelected} 
            /> }
          ItemSeparatorComponent={() => {
            return (
              <View
                style= {{ width: '100%', height: 1, backgroundColor: '#e2e2e2'}}>
              </View>
            )
          }}
        keyExtractor={(item, index) => index.toString()} />
    </View>
    </SafeAreaView>
    
  );
}

async function fetchCatalog(): Promise<shoppingItem[]> {
  const url =  'https://fakestoreapi.com/products'
  let catalog: shoppingItem[] = []
  let response = await fetch(url)
  if(response.status == 200) {
    let body: shoppingItem[] = await response.json()
    body.forEach((item: shoppingItem) => {
      let newItem: shoppingItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image
      }
      catalog.push(newItem)
    })
    return catalog
  } else {
    return catalog
  }

}

const ItemComponent = ({ item, index }: listItemProps) => {
  //const [selected, setSelected] = useState(-1)
  return (
    <TouchableOpacity onPress={() => console.log(item.id)}>
      <View style={{ padding: 10, width: '80%' }}>
        <View style={{ 
          padding: 20, 
          borderRadius: 10,  
          flexDirection: 'row',
          }}
          >
          <Image 
            style={{ height: 80, width: 80 }}
            source = {{ uri: item.image }} />
          <Text style={{ fontWeight: 'bold', padding: 10 }}>{item.title}</Text>
        </View>
    </View>
    </TouchableOpacity>
  );
}

export default function App() {
  const [data, setData] = useState<shoppingItem[]>([])
  return (
    <View style={styles.container}>
      <CatalogList data={data}/>
      <Button 
        title="fetch" 
        onPress={ async () => {
          let data: shoppingItem[] = await fetchCatalog()
          setData(data)
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
});
