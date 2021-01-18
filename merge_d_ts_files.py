#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# merge d.ts files to index.d.ts

import os


def handle_file(path):
    if os.path.isdir(path):
        dir_files = os.listdir(path)
        for dir_file in dir_files:
            handle_file(os.path.join(path, dir_file))
    else:
        handle_d_ts(path)


new_lines = []

# only retain declare class content, delete other content
def handle_d_ts(d_ts_file):
    if d_ts_file.endswith('.d.ts'):
        d_ts_file_obj = open(d_ts_file, mode='r')
        for line in d_ts_file_obj.readlines():

            if line.startswith('declare class') > -1:
                new_lines.append(line.replace('declare class', 'export declare class'))
            elif line.find('declare const _') > -1:
                break
            elif line.find('export = ') > -1:
                pass
            else:
                new_lines.append(line)
        d_ts_file_obj.close()


write_lines = []


def delete_repeat_content(new_lines):
    class_list = []
    class_dict = {}
    current_class_name = ''
    left_brace_num = 0
    for line_str in new_lines:
        origin_line_str = line_str
        line_str = line_str.strip()
        if line_str.startswith('/**') | line_str.startswith('*') | line_str.startswith('**/'):
            class_list.append(origin_line_str)
        elif line_str.endswith('{'):
            left_brace_num = left_brace_num + 1
            class_list.append(origin_line_str)
        elif line_str.endswith('}'):
            left_brace_num = left_brace_num - 1
            class_list.append(origin_line_str)
            if left_brace_num == 0:
                # save to class dict - delete repeat content
                if class_dict.get(current_class_name):
                    pass
                else:
                    class_dict[current_class_name] = class_list[:]
                class_list = []
        elif left_brace_num > 0:
            class_list.append(origin_line_str)

        if line_str.startswith('export declare class'):
            current_class_name = line_str

    for class_dict_k in class_dict.keys():
        for write_line_str in class_dict[class_dict_k]:
            write_lines.append(write_line_str)


# write to index.d.ts file
def write_to_index_d_ts(dist_dir):
    delete_repeat_content(new_lines)
    fo = open(os.path.join(dist_dir, "index.d.ts"), "w")
    fo.writelines(write_lines)
    fo.close()


dir_name = input('please input d.ts files dir: ')
dist_dir_name = input('please input dist merged index.d.ts dir: ')
if dist_dir_name:
    pass
else:
    dist_dir_name = os.getcwd()

handle_file(os.path.abspath(dir_name))
write_to_index_d_ts(dist_dir_name)

