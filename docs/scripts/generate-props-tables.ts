import fs from 'fs';
import path from 'path';
import { Node, Project, Symbol, Type, VariableDeclaration } from 'ts-morph';

console.log('__dirname: ', __dirname);

const project = new Project({
  tsConfigFilePath: path.resolve(
    __dirname,
    '../../packages/react/tsconfig.json'
  ),
});

// console.log(project);

const source = project.getSourceFile(
  path.resolve(__dirname, '../../packages/react/src/primitives/types/index.ts')
);

// console.log('path: ', source.getReferencedSourceFiles()[0].getInterfaces());

const allTypeFiles = source.getReferencedSourceFiles();

allTypeFiles.forEach((typeFile) => {
  console.log('🏠 Path: ', typeFile.getBaseName());
  console.log('🐛', typeFile.getTypeAliases()[0]?.getText());
  const typeAliases = typeFile.getTypeAliases();
  if (typeAliases) {
    typeAliases.forEach((typeAlias) => {
      const typeAliasJsDocs = typeAlias.getJsDocs();
      const typeAliasDescription = typeAliasJsDocs[0]?.getDescription() ?? '';
      const typeAliasName = typeAlias.getNameNode().getText();
      const typeAliasType = typeAlias.getTypeNode().getText();
      console.log('🍎 typeAlias with JS Docs =>');
      console.log('typeAliasDescription:', typeAliasDescription);
      console.log('typeAliasName:', typeAliasName);
      console.log('typeAliasType:', typeAliasType);
    });
  }

  typeFile.getInterfaces().forEach((typeInterface) => {
    typeInterface.getProperties().forEach((typeProperty) => {
      const propertyJsDocs = typeProperty.getJsDocs()[0];
      const propertyDescription = propertyJsDocs?.getDescription() ?? '';
      const propertyName = typeProperty.getNameNode().getText();
      const PropertyType = typeProperty.getTypeNode().getText();
      console.log('😁 interface =>');
      console.log('Description:', propertyDescription);
      console.log('Name:', propertyName);
      console.log('Type:', PropertyType);
    });
  });
});

// const properties = source.getInterfaces()[0].getProperties();
// const properties = allTypeFiles[0].getInterfaces()[0].getProperties();

// properties.forEach((property) => {
//   const propertyJsDocs = property.getJsDocs()[0];
//   const propertyDescription = propertyJsDocs.getDescription();
//   const propertyName = property.getNameNode().getText();
//   const PropertyType = property.getTypeNode().getText();
//   console.log('😁');
//   console.log('Description:', propertyDescription);
//   console.log('Name:', propertyName);
//   console.log('Type:', PropertyType);
// });
