import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface shoppingItem {
  id: number,
  title: string,
  price: number,
  description: string,
  image: string
}

type listItemProps = {
  item: shoppingItem,
  navigation: StackNavigationProp<StackParams, 'Catalog'>
}

type StackParams = {
  Catalog: undefined,
  ItemScreen: { id: number, title: string }
}

type MainScreenProps = {
  navigation: StackNavigationProp<StackParams, 'Catalog'>
}

type ItemViewScreenProps = {
  navigation: StackNavigationProp<StackParams, 'ItemScreen'>
  route: RouteProp<StackParams, 'ItemScreen'>
}

async function fetchCatalog(): Promise<shoppingItem[]> {
  const url =  'https://fakestoreapi.com/products'
  let catalog: shoppingItem[] = []
  let response = await fetch(url)
  
  if(response.status == 200) {
    let body: shoppingItem[] = await response.json()
    body.forEach((item: shoppingItem) => {
      
      catalog.push(item)
    })
    return catalog
  } else {
    return catalog
  }

}

async function fetchItem(props: {id: number}): Promise<shoppingItem> {
  const url = 'https://fakestoreapi.com/products/' + props.id.toString
  let item: shoppingItem
  let response = await fetch(url)
  let body: shoppingItem = await response.json()
  item = body
  return item
}

const ItemComponent = ({ item, navigation }: listItemProps) => {

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ItemScreen', {
        id: item.id, 
        title: item.title})}>
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

const MainScreen = ({ navigation }: MainScreenProps) => {
  
  const [data, setData] = useState<shoppingItem[]>([])

  useEffect(() => {
    async function loadData() {    
      let items: shoppingItem[] = await fetchCatalog();
      setData(items);
    }
    loadData();
  }, [])

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ width: '100%', justifyContent: 'space-evenly' }}>
        <FlatList
          style={{backgroundColor: '#f2f2f2', padding: 10}}
          data={data}
          renderItem={({ item, index }) => 
            <ItemComponent 
              item={item} 
              navigation={navigation}
              /> }
            ItemSeparatorComponent={() => {
              return (
                <View
                  style= {{ width: '100%', height: 1, backgroundColor: '#e2e2e2'}}>
                </View>
              )
            }}
          keyExtractor={(item, index) => index.toString()} />
      </SafeAreaView>
        <Button 
          title="fetch" 
          onPress={ async () => {
            let data: shoppingItem[] = await fetchCatalog()
            setData(data)
          }} />
    </View>
  );
}

const ItemScreen = ({ navigation, route }: ItemViewScreenProps) => {
  const [data, setData] = useState<shoppingItem>()
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ width: '100%', justifyContent: 'space-evenly'}}>
      {/* <Image 
        style={{ height: 150, width: 150 }}
        source={{ uri:  data.image}}/> */}
      <Text>ImageView</Text>
      <Text>ID: {route.params.id}</Text>
    </SafeAreaView>
        <Button 
          title="fetch" 
          onPress={ async () => {
            let fetchdata: shoppingItem = await fetchItem({id: route.params.id})
            setData(fetchdata)
          }} />
    </View>
  );
}

const Stack = createStackNavigator<StackParams>();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Catalog'>
        <Stack.Screen 
          name="Catalog"
          component={MainScreen}
          options={{
            title: 'Catalog',
          }} 
        />
        <Stack.Screen
          name="ItemScreen"
          component={ItemScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
});
