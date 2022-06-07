import fs from 'fs';
import path from 'path';
import { Node, Project, Symbol, Type, VariableDeclaration } from 'ts-morph';
import { globbyStream } from 'globby';

const project = new Project({
  tsConfigFilePath: path.resolve(
    __dirname,
    '../../packages/react/tsconfig.json'
  ),
});

const allTypeFilesData = new Map();

const source = project.getSourceFile(
  path.resolve(__dirname, '../../packages/react/src/primitives/types/index.ts')
);

const allTypeFiles = source.getReferencedSourceFiles();

allTypeFiles.forEach((typeFile) => {
  const typeFileName = typeFile
    .getBaseName()
    .slice(0, typeFile.getBaseName().indexOf('.ts'));
  const typeFileData = new Map();
  const typeAliases = typeFile.getTypeAliases();
  if (typeAliases) {
    typeAliases.forEach((typeAlias) => {
      const typeAliasData = new Map();
      const typeAliasJsDocs = typeAlias.getJsDocs();
      const typeAliasDescription = typeAliasJsDocs[0]?.getDescription() ?? '';
      const typeAliasName = typeAlias.getNameNode().getText();
      const typeAliasType = typeAlias.getTypeNode().getText();
      typeAliasData.set('name', typeAliasName);
      typeAliasData.set('type', typeAliasType);
      typeAliasData.set('description', typeAliasDescription);
      typeFileData.set(typeAliasName, typeAliasData);
    });
  }

  typeFile.getInterfaces().forEach((typeInterface) => {
    typeInterface.getProperties().forEach((typeProperty) => {
      const typeInterfaceData = new Map();
      const propertyJsDocs = typeProperty.getJsDocs()[0];
      const propertyDescription = propertyJsDocs?.getDescription() ?? '';
      const propertyName = typeProperty.getNameNode().getText();
      const PropertyType = typeProperty.getTypeNode().getText();
      typeInterfaceData.set('name', propertyName);
      typeInterfaceData.set('type', PropertyType);
      typeInterfaceData.set('description', propertyDescription);
      typeFileData.set(propertyName, typeInterfaceData);
    });
  });

  allTypeFilesData.set(typeFileName, typeFileData);
});

console.log(allTypeFilesData);

const getPropsTable = async () => {
  for await (const componentFilepath of globbyStream(
    path.join(
      __dirname,
      '../../docs/src/pages/[platform]/components/*/index.page.mdx'
    )
  )) {
    const regex =
      /src\/pages\/\[platform\]\/components\/(\w*)\/index\.page\.mdx/;
    const componentName = (componentFilepath as string).match(regex)[1];
    console.log('componentName:', componentName);
  }
};

getPropsTable();
