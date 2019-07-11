//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
const pumlEncoder = require('../extension');
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Test suite", function () {

    // Defines a Mocha unit test
    test("Get diagram url", function() {
        assert.equal(pumlEncoder.getURL("Bob -> Alice : hello"),
         "http://www.plantuml.com/plantuml/img/SoWkIImgAStDuNBAJrBGjLDmpCbCJbMmKiX8pSd9vt98pKi1IW80");
    });
});