/**
 * Tests unitaires pour la librarie sudoku.jsPour : créé une liste déroulante de cases à cocher.
 * 
 */
describe('Testing library sudoku.js.', function() {
 
    it('Should return the correct column for a cell', function() {
        
        expect(getColumn(-1)).toBe(-1);
        expect(getColumn(MAX_CELL_ID)).toBe(-1);
        expect(getColumn(0)).toBe(0);
        expect(getColumn(33)).toBe(6);
        expect(getColumn(80)).toBe(8);
    });

    it('Should return the correct column for a row', function() {
        
        expect(getRow(-1)).toBe(-1);
        expect(getRow(MAX_CELL_ID)).toBe(-1);
        expect(getRow(0)).toBe(0);
        expect(getRow(36)).toBe(4);
        expect(getRow(80)).toBe(8);
    });

});