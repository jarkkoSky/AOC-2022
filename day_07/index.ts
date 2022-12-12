import { readFileSync } from 'fs';
import { pipe, S, A, O, NEA, N, isNumeric, sum } from '../utils/fp-utils';

type File = {
  name: string;
  size: number;
};

type Dir = {
  path: string;
  files: File[];
};

const changeDirectory = (input: string) => {
  const match = input.match(/\$ cd (.*)/);

  if (match) {
    return match[1];
  }
  return undefined;
};

const previousDirectory = (cwd: string) => {
  const result = cwd.substr(0, cwd.lastIndexOf('/'));

  if (result === '') {
    return '/';
  }
  return cwd.substr(0, cwd.lastIndexOf('/'));
};

const getWorkingDirectory = (cwd: string, input: string) => {
  const cd = changeDirectory(input);

  if (cd) {
    if (cd === '..') {
      return previousDirectory(cwd);
    }
    if (cd === '/') {
      return '/';
    }

    return cwd === '/' ? `${cwd}${cd}` : `${cwd}/${cd}`;
  }

  return cwd;
};

const getDirectories = (cwd: string, directories: Dir[], input: string) => {
  const t = input.split(' ');

  if (isNumeric(t[0])) {
    const file = {
      name: t[1],
      size: parseInt(t[0]),
    };

    return pipe(
      directories,
      A.findIndex((x) => x.path === cwd),
      O.match(
        () =>
          A.append({
            path: cwd,
            files: [file],
          })(directories),
        (i) =>
          pipe(
            directories,
            A.modifyAt(i, (dir) => ({
              path: dir.path,
              files: A.append(file)(dir.files),
            })),
            O.getOrElse(() => [] as Dir[]),
          ),
      ),
    );
  }

  if (t[0] === 'dir') {
    return pipe(
      directories,
      A.findIndex((x) => x.path === cwd),
      O.match(
        () =>
          A.append({
            path: cwd,
            files: [] as File[],
          })(directories),
        (i) => directories,
      ),
    );
  }

  return directories;
};

const directories = pipe(
  pipe(readFileSync('./day_07/input.txt').toString('utf-8'), S.split('\r\n'), NEA.fromReadonlyNonEmptyArray),
  A.scanLeft({ cwd: '', directories: [] as Dir[] }, (state, input: string) => ({
    cwd: getWorkingDirectory(state.cwd, input),
    directories: getDirectories(state.cwd, state.directories, input),
  })),
  A.last,
  O.map(({ directories }) => directories),
  O.getOrElse(() => [] as Dir[]),
);

const directoryFilesSum = (s: string, directories: Dir[]) =>
  pipe(
    directories,
    A.filter((x) => x.path.startsWith(s)),
    A.map((x) => x.files),
    A.flatten,
    A.map((x) => x.size),
    sum,
  );

pipe(
  directories,
  A.map((dir) => directoryFilesSum(dir.path, directories)),
  A.filter((x) => x <= 100000),
  sum,
  (x) => console.log(`Part 1 answers ${x}`),
);

pipe(
  directories,
  A.map((dir) => directoryFilesSum(dir.path, directories)),
  A.filter((x) => x >= pipe(directoryFilesSum('/', directories), (totalSize) => 30000000 - (70000000 - totalSize))),
  A.sortBy([N.Ord]),
  A.head,
  O.map((x) => console.log(`Part 2 answers ${x}`)),
);
