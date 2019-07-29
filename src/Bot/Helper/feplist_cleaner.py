import requests
import json
import sys
import unicodedata

def hasNumbers(inputString):
    return any(char.isdigit() for char in inputString)


class cleaner:
    def __init__(self, url):
        self.file = requests.get(url).text.splitlines()
        self.store = {}
        self.batch_list = ['a', 'b', 'c', 'd', 'e']

    def set_store(self, data):
        if data['batch'] not in self.store.keys():
            self.store[data['batch']] = []

        selected_user_data = [data['name'],
                              data['campus'], data['room']]

        self.store[data['batch']].append(selected_user_data)

    def numbers_sect(self, args):
        num = ''
        for i in args[0]:
            if hasNumbers(i):
                args[0] = args[0].replace(i, '').strip()
                num += i

            if args[0][0] == '.':
                args[0] = args[0][1:].strip()

        return num

    def batch_validate(self, str):
        return not hasNumbers(str) and str.lower() in self.batch_list

    def run(self):
        intersected_line = []
        for line in range(0, len(self.file)):
            if len(self.file[line]) > 0 and self.batch_validate(self.file[line][0]):
                batch = self.file[line][0].lower()
                continue

            lstrip = self.file[line].strip()
            lsplit = self.file[line].split('-')
            normalize = [unicodedata.normalize('NFKD', l).encode('ascii','ignore') for l in lsplit]
            args = list(map(str.strip, normalize))
            args.insert(0, self.numbers_sect(args))
          
            if len(args) >= 1 and '' not in args:
                data = {
                    'batch': batch,
                    'name': args[1],
                    'campus': args[2],
                    'room': '' if len(args) < 4 else args[3],
                }
                self.set_store(data)

                
if __name__ == "__main__":
    url = str(sys.argv[1])
    if url is not None:
        fep_list = cleaner(url)
        fep_list.run()
        fepl_json = json.dumps(fep_list.store, indent=4)
        sys.stdout.write(fepl_json)
