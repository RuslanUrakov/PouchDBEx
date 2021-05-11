/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { appSchema, tableSchema, Model, Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { field } from '@nozbe/watermelondb/decorators';


const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'todos',
      columns: [
        { name: '_id', type: "string" },
        { name: "title", type: "string" },
        { name: "completed", type: "boolean" },
      ]
    }),
  ]
});

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: error => {
    console.log("Error:", error);
  }
});

class Todo extends Model {
  static table = 'todos';

  @field('_id') _id;
  @field('title') title;
  @field('completed') completed;
};

const db = new Database({
  adapter,
  modelClasses: [Todo],
  actionsEnabled: true,
});

const todos = db.collections.get('todos');

const addTodo = async ({ title, completed }) => {
  await db.action(async () => {
    const Todo = await todos.create(todo => {
      todo._id = new Date().toISOString();
      todo.title = title;
      todo.completed = completed;
    })
  });
};

const deleteAllTodos = async () => {
  await db.action(async () => {
    await todos.query().destroyAllPermanently();
  });
}

const showTodos = async () => {
  const todosResults = await todos.query().fetch();
  console.log(todosResults.length);
  console.log("Fecthed todos", todosResults);
};

const runQueries = async () => {
  await deleteAllTodos();
  await addTodo({
    title: "First Todo",
    completed: false,
  });
  await addTodo({
    title: "Second Todo",
    completed: true,
  });
  await showTodos();
}

runQueries();

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
