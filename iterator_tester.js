/*
 * functions to init and test out the Iterator (Q1)  and the "section" div parse and iterate (Q2)
 *
 */
///// start init and test functions /////

var gs_displayDiv;

//init the iterator and test it out. This is currently called by body.onload
function initerator(b_test_q1, b_test_q2) {
    gs_displayDiv = document.createElement("div");
    document.body.appendChild(document.createElement("hr"));
    document.body.appendChild(gs_displayDiv);
   
        
    if (b_test_q1) testQ1(gs_displayDiv);
    if (b_test_q2) testQ2(gs_displayDiv, b_test_q1);
}

//note: if passing in an existing array, the original array gets copied to avoid being modfied by a reverse call
//though Iterator itself supports either copying or not
function testQ1(o_display_div, a_test_array0, s_tag_val0) {
    var b_copy_array;
    if (a_test_array0) {
        a_test_array = a_test_array0;
        s_tag_val = s_tag_val0;
        b_copy_array = true;
    } else {
        a_test_array = ["one", "two", "buckle", "my", "shoe","three","four","shut","the","door"];
        s_tag_val = "shoe";
        b_copy_array = false;
    }
    var s_test_results = "Results of testing Iterator for Q1:<br><br>" + getTestResults(a_test_array, false, b_copy_array, s_tag_val, true, true);
    
    o_display_div.innerHTML = s_test_results;
}

function testQ2(o_display_div, b_append) {
    var o_iterator = getFirstSectionDivArrayIterator();
    var s_test_results = "Results of running Q2 (finding first section div and creating array) and iterating array:<br><br>";
    if (o_iterator) {
        var s_tag_val;
        var num_items = o_iterator.i_num_items;
        
        if (num_items > 2) s_tag_val = o_iterator.a_data[num_items - 2];//penultimate value
        else s_tag_val = o_iterator.a_data[num_items - 1];
        s_test_results += getTestResults(o_iterator, true, false, s_tag_val);
    } else {
        s_test_results += "ERROR: Couldn't find first section";
    }
    
    if (b_append && (o_display_div.innerHTML != "")) {
        s_test_results = gs_displayDiv.innerHTML + "<hr />" + s_test_results;
    }
    o_display_div.innerHTML = s_test_results; 
}

//test the Iterator. Examples are described in the output
function getTestResults(a_test_array_or_iterator, b_is_iterator, b_copy_array, s_tag_val, b_show_move_next_example, b_show_all_tag_example) {

    var s_section_sep = "<br><br>";
    var s_line_sep = "<br>";
    
    var test_iterator = b_is_iterator ? a_test_array_or_iterator : Iterator(a_test_array, b_copy_array);
    
    var s_display = "Original: " + test_iterator.a_data;
    var tag_func;
    
    s_display += s_section_sep + "Iterate Results:";
    
    var s_one_val;
    var a_tags;
    if (b_show_all_tag_example) {
        a_tags = [];
        
        //iterate through, and cache all the functions returned by tag (a well as the value that the function should return)
        while(test_iterator.hasNext()) {
            test_iterator.next();
            a_tags.push({f_t : test_iterator.tag(), v : test_iterator.current()});
        }
        var o_one_tag;
        for (var i = 0; i < a_tags.length; i++) {
            o_one_tag = a_tags[i];
            s_display += s_line_sep + o_one_tag.v + "(tag test val:" + o_one_tag.f_t() + ")";
        }
    } else {
         while(test_iterator.hasNext()) {
            test_iterator.next();
            s_display += s_line_sep + test_iterator.current();
        }
    }
    
    
    //call reversal at tag:
    test_iterator.restart();
    tag_func = null;
    
    s_display += s_section_sep + "Reset, then iterate until single tag (" + s_tag_val + "), then call reverse, then keep iterating to new end:";
    
    while(test_iterator.hasNext()) {
        test_iterator.next();
        s_one_val = test_iterator.current();
        s_display += s_line_sep + s_one_val;
        if (s_one_val == s_tag_val) {
            tag_func = test_iterator.tag();
            test_iterator.reverse();
            s_display += s_line_sep + "(reversal called at tag) current val after reverse: " + test_iterator.current();
        }
    }
    
    s_display += s_section_sep + "Reversal Tag: (should be: " + s_tag_val + "): " + (tag_func ? tag_func() : "null");
    
    if (b_show_move_next_example) {
        test_iterator.reverse();//reverse to set back to original order
        test_iterator.restart();
        s_display += s_section_sep + "Move Next Version (after reversing back to original and restarting):";
        while(test_iterator.moveNext()) {
            s_display += s_line_sep + test_iterator.current();
        }
    }
    
    return s_display;
}

///// end init and test functions /////