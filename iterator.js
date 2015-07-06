/* Q1 Iterator
     *
     *A class for iterating through an array, implementing required functions.
     *
     *Call constructor with b_copy_array=true if you don't want your original array modified (by reverse)
     *  or to allow you to modify/resize your original array during the iteration and not worrying
     *  about iterating completely.
     *  NOTE: copy is not deep copy, so if your array is an array of objects, the copy will still have the
     *      same objects
     *
     *  NOTE: constructor prepares the Iterator for iteration, so you don't need to call
     *      restart() until you want to restart the loop
     *      
     *  Two ways to iterate:
     *
     *  while(Iterator.hasNext()) {
            Iterator.next() to advance index and retrieve next value
        }
        
        or
        
        while(Iterator.MoveNext()) {
            Iterator.current() to retrive the current value
        }
        
        call Iterator.reverse() to reverse order (keeping current the same)
        
        call Iterator.tag() to get a function that will return the value a the time you had called tag. Can be called
            multiple times and each returned function will all you do see the value at the time you called tag
            
        call Iterator.restart() to reset the index in preparation of a new iteration
        
        
        itquest.html page tests it out via testQ1
     */
var Iterator = function(a, b_copy_array) {
    if (a) {
        if (!b_copy_array) this.a_data = a;
        else this.a_data = a.slice(0);
    } else {
        this.a_data = new Array();
    }
    this.i_current = -1;
    this.i_num_items = this.a_data.length;
    this.i_max_index = this.i_num_items - 1;
    
    //can we iterate further?
    this.hasNext = function() {
        return (this.i_current < this.i_max_index); 
    }
    
    //move the iteration index to the next spot, and return the value, if any
    this.next = function() {//assumes only calling this if hasNext has been called, else will return null if past the end
        this.i_current++;
        return this.a_data[this.i_current];//we know it's > -1, and no harm if it's >= a_data.length, as it will just return null
    }
    
    //uses the current interation index to return that value from the array
    //we don't cache the value during the iteration, to allow the array to be modified from the outside, potentially
    this.current = function() {
        return this.a_data[this.i_current];
    }
    
    //set the tagged val, and then return a function that can be called to retrieve the tagged val
    //NOTE: tag can be called multiple times, and each function that it returns will give the value
        //at the tag was called
    this.tag = function() {
        var val = this.current();
        return function() {return val;}
    }
    
    //reverse the array, but keep the current index of the iterator the same
    //NOTE: the requirements example states that the array itself should be reversed
        //as opposed to reversing the order of iteration, though you could do it that way
        //if you wanted to avoid modifying the actual array.
    //NOTE: call the constructor with b_copy_array=true to copy the array and not have reverse mess with the original
    this.reverse = function() {
        this.a_data.reverse();
        //note: it is unclear from the requirements if the i_current index itself should be modified to point to the same item
        //or if only a call to this.current should return that value... I'm implementing it to actually modify the index,
        //so that if you do next() it will go to the next item after the i_current
        this.i_current = this.i_max_index - this.i_current;
        //note that if i_current was -1 (never called next), this would now be a_data.length, and so current would be null (which actualy makes sense :)
    }
    
    //reset the iterator to the beginning
    //NOTE: it assumes that you will be calling next() before calling current()
    this.restart = function() {
        this.i_current = -1;
    }
    //an alternative way to iterate, ie,
        //Iterator.restart();
        //while(Iterator.moveNext()) {
            //do something with Iterator.current()    
        //}
        //I often do it this way, which is why I offered it up :)
    this.moveNext = function() {
        if (this.i_current < this.i_max_index) {
            this.i_current++;
            return true;
        } else {
            return false;
        }
    }
    
    return this;
}
/////end Q1 /////

////q 2:
/*
 *The way I interpreted question 2 was "Find the first div in the document that had the class 'section'
 *  and then turn the innerHTML of that div into an array of strings, that are separated by whitespace or
 *  whitespace-esque characters. Then take that array and load it into the Iterator class from question 1
 *
 *  getFirstSectionDivArrayIterator is the main function here, which first finds and then parses the div into an array,
 *  and creates an instance of Iterator with it
 *  
 *  In the itquest.html page, testQ2 calls it and runs the results through getTestResults to test it out
 */

//given an element type and a class (ie "DIV", "section") returns the first matching element in the doc
function getFirstElemOfTypeWithClass(elem_tag, class_name) {
    var a_elems;
    var o_match;
    elem_tag = elem_tag.toUpperCase();//safety first!
    if (document.getElementsByClassName) {//does browser support this
        a_elems = document.getElementsByClassName(class_name);
        for (var i = 0; i < a_elems.length; i++) {
            if (a_elems[i].nodeName == elem_tag) {
                o_match = a_elems[i];
                break;
            }
        }
    } else {//fallback for if browser is old and doesn't support document.getElementsByClassName
        a_elems = document.getElementsByTagName(elem_tag);
        for (var i = 0; i < a_elems.length; i++) {
            if (a_elems[i].classname == class_name) {
                o_match = a_elems[i];
                break;
            }
        }
    }
    return o_match;
}

//given an elem, get its innerHTML, and split it by spaces after converting any extraneous runs of whitespace into a single space
function getStringsArrayFromElemInnerHTML(elem) {
    var s_it = elem.innerHTML.trim();
    s_it = s_it.trim().replace(/\s\s+/g, ' ');//replace multiple spaces, as well as other (single or multiple) white-space equivalients (tab, etc), with single space
    var a = s_it.trim().split(" ");
    
    return a;
}

//find the first DIV with the class "section", take its innerHTML contents and split into an array,
//returns null if it can't find the section, whereas it returns an Iterator with an array with no items
//if it finds the section but it is empty
function getFirstSectionDivArrayIterator() {
    var o_first_section = getFirstElemOfTypeWithClass("DIV", "section");
    var o_iterator;
    if (o_first_section) {
        var a = getStringsArrayFromElemInnerHTML(o_first_section);
        
        o_iterator = Iterator(a, false);
    }
    return o_iterator;
}
 
 
////// end of q2 specific ///////