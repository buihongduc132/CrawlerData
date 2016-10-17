var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));
var fileHelper = require(path.join(pathToRoot, moduleLocation.fileHelper));

describe('Data Helper', () => {
    describe('Read file', () => {
        it('should find the specific file', () => {
            fileHelper.readFile(testData.readFile).then((result) => {
                expect(result).not.equal(null);
            });
        });
        it('should return the correct text', () => {
            fileHelper.readFile(testData.readFile).then((result) => {
                expect(result).equal('This is test for reading file');
            });
        })
    });

    describe('Write file', () => {
        it('should create and write file with correct content', () => {
            var seed = JSON.stringify(Math.random());
            var filePath = testData.writeFile;
            fileHelper.writeFile(filePath, seed).then(() => {
                expect(filePath).is.a.file();
                expect(filePath).to.have.content(seed);
            })
        })
    });

    describe('Read directory', () => {
        it('should get all files name in test folder', () => {
            var fileNames = ["File1", "File2.json", "File3.xml", "File4.json"];
            fileHelper.getFiles(testData.readDir).then((result) => {
                expect(result).deep.equal(fileNames);

                fileNames.forEach((name) => {
                    expect(path.join(testData.readDir, name)).to.be.a.file;
                });
            });
        });
    });

    describe('Read directory for find type', () => {
        it('it should get all the json file in test folder', () => {
            var fileNames = ["File2.json", "File4.json"];

            fileHelper.getFilesByType(testData.readDir).then((result) => {
                expect(result).deep.equal(fileNames);

                fileNames.forEach((fileName) => {
                    expect(path.join(testData.readDir, fileName)).to.have.extname('.json');
                });
            });
        })
    });
});